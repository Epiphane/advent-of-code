module.exports = {
    count: (array, filter) => {
        let result = 0;
        array.forEach(el => {
            let res = filter(el);
            if (res === true) { result ++; }
            else if (typeof(res) === 'number') { result += res; }
        });
        return result;
    }
};