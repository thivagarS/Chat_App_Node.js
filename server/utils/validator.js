const isRealString = str => {
    if(str.trim().length > 0 && typeof str === 'string')
        return true
}

module.exports= {isRealString}