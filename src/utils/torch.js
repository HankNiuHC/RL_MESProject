/**
 * 打开闪光灯
 */
function onTorch() {
  try {
    var main = plus.android.runtimeMainActivity();
    var camera = main.getSystemService('camera');
    var ids = plus.android.invoke(camera, 'getCameraIdList');
    for (var i = 0; i < ids.length; i++) {
      var c = plus.android.invoke(camera, 'getCameraCharacteristics', ids[i]);
      var available = plus.android.invoke(c, 'get', plus.android.getAttribute(c, 'FLASH_INFO_AVAILABLE'));
      var facing = plus.android.invoke(c, 'get', plus.android.getAttribute(c, 'LENS_FACING'));
      if (null != available && available && null != facing && 1 == facing) {
        plus.android.invoke(camera, 'setTorchMode', ids[i], true);
      }
    }
  } catch (e) {
    console.error('error @onTorch!!');
  }
}

/**
 * 关闭闪光灯
 */
function offTorch() {
  try {
    var main = plus.android.runtimeMainActivity();
    var camera = main.getSystemService('camera');
    var ids = plus.android.invoke(camera, 'getCameraIdList');
    for (var i = 0; i < ids.length; i++) {
      var c = plus.android.invoke(camera, 'getCameraCharacteristics', ids[i]);
      var available = plus.android.invoke(c, 'get', plus.android.getAttribute(c, 'FLASH_INFO_AVAILABLE'));
      var facing = plus.android.invoke(c, 'get', plus.android.getAttribute(c, 'LENS_FACING'));
      if (null != available && available && null != facing && 1 == facing) {
        plus.android.invoke(camera, 'setTorchMode', ids[i], false);
      }
    }
  } catch (e) {
    console.error('error @offTorch!!');
  }
}


module.exports = {
  on: onTorch,
  off: offTorch
};
