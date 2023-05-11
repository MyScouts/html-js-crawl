const BASE_VOLKSWAGEN_URL = 'https://prod-ds.dcc.feature-app.io/v1-189-0'

const getListVolkswagen = async () => {
    const queries = {
        serviceConfigsServiceConfig: JSON.stringify({
            "key": "service-config",
            "urlOrigin": "https://www.volkswagen.de",
            "urlPath": "/de.service-config.json",
            "tenantCommercial": null,
            "tenantPrivate": null,
            "customConfig": null,
            "homePath": null,
            "credentials": null
        }),
        query: JSON.stringify({
            "type": "DEALER",
            "language": "de-DE",
            "countryCode": "DE",
            "dealerServiceFilter": [],
            "contentDealerServiceFilter": [],
            "usePrimaryTenant": true,
            "name": " "
        })
    }

    const response = await fetch(`${BASE_VOLKSWAGEN_URL}/bff-search/dealers?` + new URLSearchParams(queries), {
        method: 'GET',
    });

    const { dealers } = await response.json();
    return dealers;
}

const getVolkswagenDetail = async (dealerId, countryCode) => {
    const requestId = dealerId.slice(1);
    const queries = {
        serviceConfigsServiceConfig: JSON.stringify({ "key": "service-config", "urlOrigin": "https://www.volkswagen.de", "urlPath": "/de.service-config.json", "tenantCommercial": null, "tenantPrivate": null, "customConfig": null, "homePath": null, "credentials": null }),
        query: JSON.stringify({ "dealerId": requestId, "countryCode": countryCode, "language": "de", "usePrimaryTenant": true })
    }

    const response = await fetch(`${BASE_VOLKSWAGEN_URL}/bff-detail/dealer?` + new URLSearchParams(queries), {
        method: 'GET',
    });

    const { dealer } = await response.json();
    return dealer;
}

const processCrawlVolkswagen = async () => {
    const stores = await getListVolkswagen();
    const storeSize = stores.length;
    const resultArr = [];
    for (let index = 0; index < storeSize; index++) {
        const store = stores[index];
        const storeInfo = await getVolkswagenDetail(store.id, 'DE');
        if (storeInfo) {
            let data = {
                Name: storeInfo.name,
                Address: `${storeInfo.address.street}, ${storeInfo.address.postalCode}, ${storeInfo.address.city}`,
                EmaiL: store.contact?.email,
                Phone: removeAllSpace(store.contact?.phoneNumber || ''),
                Webite: storeInfo.contact?.website,
                Rating: storeInfo.ratings?.avgRating || 0,
                ...generateDepartments(storeInfo.departments)
            }
            resultArr.push(data)
        }
    }
    return resultArr;
}

const mappingDepartments = (departments) => {
    return departments.map((department, index) => {
        const days = department.businessHours?.days;
        const timeStr = days.map((day, dayIndex) => {
            const dayName = day.label;
            const time = day.displayTimes && day.displayTimes.length > 0 ? `${day.displayTimes[0].from}-${day.displayTimes[0].till}` : '';
            return `${dayName}: ${time}.`;
        }).join('\n');
        const address = [department.street, department.postalCode, department.city].filter((item) => !!item).join(',');
        const contact = department.contact;
        return `Email: ${contact.email}. \nPhone number: ${contact.phoneNumber}. \nWebsite: ${contact.website}. \nAddress: ${address}. \nTime: ${timeStr}`;
    });
}

const generateDepartments = (departments) => {
    const departmentObj = {};
    if (!departments || departments.length <= 0) return departmentObj;

    mappingDepartments(departments).forEach((item, index) => {
        departmentObj[`Department ${index + 1}`] = item;
    })
    return departmentObj;
}