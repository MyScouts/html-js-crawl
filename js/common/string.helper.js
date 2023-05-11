const mappingBusinessTime = (inputTime) => {
    let resultStr = '';
    for (const [key, value] of Object.entries(inputTime)) {
        let dayValue = value;
        let timeStr = '';
        if (dayValue.timePeriods && dayValue.timePeriods.length > 0) {
            const time = dayValue.timePeriods[0];
            timeStr = `${time.from}:${time.to}`
        }
        resultStr += `${key.toLowerCase()}: ${timeStr}. \n`;
    }
    return resultStr;
}

const removeAllSpace = (value) => value.replace(/\s/g, '');
