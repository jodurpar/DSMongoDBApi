
// Usage:

//let mensaje: logsStructure = {
//    error: HTTPStatusCodes.OK,
//    cat: 'cat_1',
//    sub_cat: 'sub_cat_1',
//    mensage: 'Esto es un mensaje',
//    data: {}, // { "modulo": "app.js", "metodo": "root" },
//    args_mine: [] //['esto es mas','Y otro mas']
//}

// Banyan.EsLog.info(mensaje, 'Texto del mensaje');
// Banyan.EsLog.info(mensaje);

export interface logsStructure {
    error: HTTPStatusCodes,
    cat: string,
    sub_cat: string,
    mensage: string,
    data: object,
    args_mine: any[]
}

//export {
//    logsStructure
//};