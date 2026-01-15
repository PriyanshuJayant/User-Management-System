function monitor(){
    const monitor = process.memoryUsage();
    const memoryUsage = {
        rss: monitor.rss / 1024 / 1024,
        heapTotal: monitor.heapTotal / 1024 / 1024,
        heapUsed: monitor.heapUsed / 1024 / 1024,
        external: monitor.external / 1024 / 1024
    };
    const totalMB = Object.values(memoryUsage).reduce((acc, val) => acc + val, 0);
    console.log('  rss:', memoryUsage.rss.toFixed(2), 'MB');
    console.log('  heapTotal:', memoryUsage.heapTotal.toFixed(2), 'MB');
    console.log('  heapUsed:', memoryUsage.heapUsed.toFixed(2), 'MB');
    console.log('  external:', memoryUsage.external.toFixed(2), 'MB');
    console.log('  Total:', totalMB.toFixed(2), 'MB');
}

module.exports= monitor;