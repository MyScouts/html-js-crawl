const BASE_URL = 'https://api.oneweb.mercedes-benz.com/dlc-dms/v2/dealers/search'

const getListStore = async () => {
    const headers = {
        'Content-Type': 'application/json',
        'x-apikey': '45ab9277-3014-4c9e-b059-6c0542ad9484',
    };

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
        headers: headers,
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
        headers: headers,
    })

    const { results } = await response.json();
    return results && results.length > 0 ? results[0] : null;
}
