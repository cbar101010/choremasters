export const Util = {
    sameDay: function (date1, date2) {
        if (date1 instanceof Date && date2 instanceof Date) {
            return (date1.getYear() === date2.getYear() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getDate() === date2.getDate());
        } else {
            console.log("sameDay(date1,date2) not called with Date objects");
            return false;
        }
    },
    isBiWeekly: function(startDate) {
        let today = new Date();
        // Move start date to Sunday first day of the week.

        let diff = (today.getMilliseconds() - startDate.getMilliseconds()) / 1000;
        let oneDay = 60 * 60 * 24;
        let daysDifference = Math.floor(diff / oneDay);
        //if ((daysDifference % 14) >= 7)
        //if ()
        //if (today - startDate) {

        //}
    },
    getDateString: function(date) {
        let month = date.getMonth() + 1;
        let day = date.getDate();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        return `${date.getFullYear()}-${month}-${day}`;
    },
    getDayString: function(day) {
        let result = 'sunday';
        switch(day) {
            case 1:
                result = 'monday';
                break;
            case 2:
                result = 'tuesday';
                break;
            case 3:
                result = 'wednesday';
                break;
            case 4:
                result = 'thursday';
                break;
            case 5:
                result = 'friday';
                break;
            case 6:
                result = 'saturday';
                break;
        }
        return result;
    },
    sameChore: function (chore1, chore2) {
        let same = false;
        if (chore1 && chore2) {
            if (chore1.owner === chore2.owner &&
                chore1.title === chore2.title &&
                chore1.description === chore2.description &&
                chore1.startdate === chore2.startdate &&
                chore1.rollOver === chore2.rollOver) {
                same = true;
            }
        }
        return same;
    },
    createUID() {
        let dt = new Date().getTime();
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            let r = (dt + Math.random()*16)%16 | 0;
            dt = Math.floor(dt/16);
            return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });
        return uuid;
    },
    /**
     * filter works the same as Array.filter
     * @param obj - object to filter
     * @param keep - function that returns true if we should keep the property in the result object
     * @returns {any}
     */
    filter(obj, keep) {
        let result = Object.assign({}, obj);
        Object.keys(result).forEach(key => {
            if (!keep(result[key])) {
                delete result[key];
            }
        });
        return result;
    }
};