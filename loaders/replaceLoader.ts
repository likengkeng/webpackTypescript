module.exports = function(source){
    console.log('!!!!!', this.query);
    let content = source;
    content = content.replace(/hello/g, this.query.name);
    return content;
}