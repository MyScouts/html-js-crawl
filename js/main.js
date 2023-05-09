
$(document).ready(function () {
    $('#startCrawlMercedes').click(async function () {
        // enable loading
        const loadingElm = $(this).find('.loading');
        $(this).attr('disable', true);
        loadingElm.attr('hidden', false)

        // process crawl data
        const stores = await getListStore();
        const resultArr = [];

        const storeLength = stores.length;
        for (let i = 0; i < storeLength; i++) {
            const store = stores[i];
            const storeInfo = await getStoreInfoById(store.baseInfo.externalId);
            if (!storeInfo) continue;
            const storeName = storeInfo.baseInfo.name1;
            const storeAddress = `${storeInfo.address.line1},${storeInfo.address.city}`;
            const storePhone = storeInfo.contact.phone;
            const storeEmail = storeInfo.contact.email;
            const storeWebsite = storeInfo.contact.website;

            // Get sale infos
            let saleInfo = '';
            const foundSales = storeInfo.functions.filter((e) => e.activityCode == 'SALES');
            for (const sale of foundSales) {
                const saleEmail = sale.contact.email || '';
                const saleTime = mappingBusinessTime(sale.openingHours);
                saleInfo += `Email: ${saleEmail} \n Time: ${saleTime}. \n`;
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
                name: storeName,
                address: storeAddress,
                phone: storePhone,
                email: storeEmail,
                website: storeWebsite,
                saleInfo: saleInfo,
                partInfo: partInfo,
            }
            resultArr.push(resultObj);
        }
        console.log("🚀 ~ file: main.js:51 ~ resultArr:", resultArr)
        // hidden loading
        $(this).attr('disable', false);
        loadingElm.attr('hidden', true)
    });
});
