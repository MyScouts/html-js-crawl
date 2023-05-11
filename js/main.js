$(document).ready(function () {
    $('#startCrawlMercedes').click(async function () {
        const element = this;
        checkAndChangeLoadingStatus(element, async () => {
            try {
                const data = await processCrawlMercedes();
                makeExportAndDownload(data, "mercedes-benz.de.xlsx");
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                })
            }
            disableLoading(element);
        })
    })

    $('#startCrawlOpel').click(async function () {
        const element = this;
        checkAndChangeLoadingStatus(element, async () => {
            try {
                const data = await processCrawlOpel()
                makeExportAndDownload(data, "opels.xlsx");
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    footer: '<a href="https://cors-anywhere.herokuapp.com/corsdemo" target="_blank">Click here fix your issue?</a>'
                })
            }
            disableLoading(element);
        })

    });

    $('#startVolkswagenCrawl').click(async function () {
        const element = this;
        checkAndChangeLoadingStatus(element, async () => {
            try {
                const data = await processCrawlVolkswagen()
                makeExportAndDownload(data, "Volkswagen.xlsx");
            } catch (error) {
                console.log("🚀 ~ file: main.js:43 ~ checkAndChangeLoadingStatus ~ error:", error)
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                })
            }
            disableLoading(element);
        })
    });
});

const checkAndChangeLoadingStatus = (element, callback) => {
    const loadingElm = $(element).find('.loading');
    const isLoading = !loadingElm.prop('hidden');
    if (isLoading) return;
    loadingElm.attr('hidden', false)
    callback();
}

const disableLoading = (element) => {
    const loadingElm = $(element).find('.loading');
    $(element).attr('disable', false);
    loadingElm.attr('hidden', true)
}