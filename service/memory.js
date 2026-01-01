const used = process.memoryUsage();

function memoryUsage() {
    const memoryUsage = {
        rss: used.rss / 1024 / 1024,
        heapTotal: used.heapTotal / 1024 / 1024,
        heapUsed: used.heapUsed / 1024 / 1024,
        external: used.external / 1024 / 1024
    };
    const totalMB = Object.values(memoryUsage).reduce((acc, val) => acc + val, 0);
    console.log('  rss:', memoryUsage.rss.toFixed(2), 'MB');
    console.log('  heapTotal:', memoryUsage.heapTotal.toFixed(2), 'MB');
    console.log('  heapUsed:', memoryUsage.heapUsed.toFixed(2), 'MB');
    console.log('  external:', memoryUsage.external.toFixed(2), 'MB');
    console.log('  Total:', totalMB.toFixed(2), 'MB');
}

module.exports = memoryUsage;