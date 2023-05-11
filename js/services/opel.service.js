const BASE_URL_OPEL = 'https://cors-anywhere.herokuapp.com/https://www.opel.de/apps/atomic/DealersServlet'
const DEFAULT_OPEL_HEADERS = {
    accept: 'application/json',
};

const getListOpel = async () => {
    const queries = {
        distance: 300,
        latitude: 52.51604,
        longitude: 13.37691,
        maxResults: 40,
        orderResults: false,
        path: "L2NvbnRlbnQvb3BlbC93b3JsZHdpZGUvZ2VybWFueS9kZQ==",
        searchType: "latlong",
    };

    const response = await window.fetch(`${BASE_URL_OPEL}?` + new URLSearchParams(queries), {
        method: 'GET',
        headers: DEFAULT_OPEL_HEADERS,
    })

    const data = await response.json();
    const { status, payload: { dealers } } = data;
    return dealers;
}

const processCrawlOpel = async () => {
    const oepls = await getListOpel();
    const results = oepls.map((item, index) => {
        const name = item.dealerName;
        const email = item.generalContact.email;
        const phone = removeAllSpace(item.generalContact.phone1);

        const addressObj = item.address;
        const address = `${addressObj.addressLine1}, ${addressObj.postalCode} ${addressObj.cityName}`;
        const services = item.services.map((service, index) => service.name).join(`\n`);
        const certification = item.certification.map((cer, index) => cer.name).join(`\n`);
        return {
            Name: name,
            Email: email,
            'Phone number': phone,
            Address: address,
            Services: services,
            Certifications: certification
        }
    })
    return results;
}