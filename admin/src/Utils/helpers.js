const helpers = {
    numberFormat: num => new Intl.NumberFormat().format(num),
    getCurrentTime: () => {
        const currentTime = new Date();
        const options = {
            timeZone: 'Asia/Ho_Chi_Minh',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        };
        const formatter = new Intl.DateTimeFormat('vi-VN', options);
        const vietnamTime = formatter.format(currentTime);
        return vietnamTime;
    },
    getCurrentDate: () => {
        const currentTime = new Date();
        const options = {
            timeZone: 'Asia/Ho_Chi_Minh',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        };
        const formatter = new Intl.DateTimeFormat('vi-VN', options);
        const vietnamTime = (formatter.format(currentTime));
        return vietnamTime
    }
}
export default helpers   