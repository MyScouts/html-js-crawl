const BASE_URL = 'https://api.oneweb.mercedes-benz.com/dlc-dms/v2/dealers/search'
const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'x-apikey': '45ab9277-3014-4c9e-b059-6c0542ad9484',
};

const getListStore = async () => {
    const queries = {
        "distance": "25km",
        "expand": "false",
        "fields": "address.latitude,address.longitude,baseInfo.name1,baseInfo.name2,baseInfo.externalId,brands.brand.code,brands.brandCode,brands.businessName",
        "configurationExternalId": "OneDLC_Dlp",
        "includeApplicants": "true",
        "localeLanguage": "false",
        "marketCode": "DE",
        "searchProfileName": "DLp_de",
        "size": -1,
        "spellCheck": "true",
        "strictGeo": "true"
    };

    const response = await window.fetch(`${BASE_URL}?` + new URLSearchParams(queries), {
        method: 'GET',
        headers: DEFAULT_HEADERS,
    })
    const { results } = await response.json();
    return results;
}

const getStoreInfoById = async (storeId) => {
    const headers = {
        'Content-Type': 'application/json',
        'x-apikey': '45ab9277-3014-4c9e-b059-6c0542ad9484',
    };
    const queries = {
        localeLanguage: false,
        id: storeId,
        fields: '*'
    }

    const response = await window.fetch(`${BASE_URL}/byId?` + new URLSearchParams(queries), {
        method: 'GET',
        headers: DEFAULT_HEADERS,
    })

    const { results } = await response.json();
    return results && results.length > 0 ? results[0] : null;
}

const processCrawlMercedes = async () => {
    // process crawl data
    const stores = await getListStore();
    const resultArr = [];

    const storeLength = stores.length;
    for (let i = 0; i < storeLength; i++) {
        const store = stores[i];
        const storeInfo = await getStoreInfoById(store.baseInfo.externalId);
        if (!storeInfo) continue;
        const storeName = storeInfo.baseInfo.name1;
        const storeAddress = `${storeInfo.address.line1}, ${storeInfo.address.zipcode} ${storeInfo.address.city}`;
        const storePhone = removeAllSpace(storeInfo.contact.phone || '');
        const storeEmail = storeInfo.contact.email;
        const storeWebsite = storeInfo.contact.website;

        // Get sale infos
        let saleInfo = '';
        const foundSales = storeInfo.functions.filter((e) => e.activityCode == 'SALES');
        for (const sale of foundSales) {
            const saleEmail = sale.contact.email || '';
            const saleTime = mappingBusinessTime(sale.openingHours);
            saleInfo += `Email: ${saleEmail} \nTime: \n${saleTime}. \n`;
        }

        // Get part info
        let partInfo = '';
        const foundPart = storeInfo.functions.find((item) => item.activityCode == 'PARTS');
        if (foundPart) {
            const partEmail = foundPart.contact.email;
            const partTime = mappingBusinessTime(foundPart.openingHours);
            partInfo += `Email: ${partEmail} \n Time: ${partTime}. \n`;
        }

        const resultObj = {
            'Name': storeName,
            'Address': storeAddress,
            'Phone': storePhone,
            'Email': storeEmail,
            'Website': storeWebsite,
            'Neufahrzeugverkauf': saleInfo,
            'Teile': partInfo,
        }
        resultArr.push(resultObj);
    }
    return resultArr;
}
