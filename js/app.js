
if ('serviceWorker' in navigator){
    navigator.serviceWorker.register('./sw.js')
        .then( regirstrado => console.log('se intalo correctamente:', regirstrado))
        .catch( error => console.log('No se intalo correctamente:', error));
}else{
    console.log('Service workers are not supported in this browser');
}