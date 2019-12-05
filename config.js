var fileHost = "https://jx360.oss-cn-beijing.aliyuncs.com";
const config = {
  // api_base_url: 'https://sapi.jx360.com',
  api_base_url: 'http://172.17.8.12:8012',
  uploadImageUrl: `${fileHost}`, // 默认存在根目录，可根据需求
  AccessKeySecret: 'a8sF73ymulDhpaV4YpDS8KEXRI4MHS', // AccessKeySecret 去你的阿里云上控制台上找
  OSSAccessKeyId: 'LTAIWlPaS1Mj29Rx', // AccessKeyId 去你的阿里云上控制台上找
  timeout: '80000', //这个是上传文件时Policy的失效时间
  bucket: 'jx360'
}

export { config }