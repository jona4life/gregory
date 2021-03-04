module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true
        }
    },
    // target: 'electron-renderer',
    // configureWebpack: (config) => {
    //     config.externals = { 'child_process': 'require("electron").remote.require("child_process")' };
    // },
};