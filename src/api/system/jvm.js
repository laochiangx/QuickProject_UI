const baseUrl =
  process.env.NODE_ENV === "development" ? "http://localhost:11010" : "";

  import request from '@/utils/request'
  import Qs from 'qs'
  
  const systemjvmApi = {

  getDomains: `${baseUrl}/bean/domains`,
  getProperties: `${baseUrl}/bean/properties`,
  invokeMethod: `${baseUrl}/bean/run`,
  overview: `${baseUrl}/dashboard/overview`,
  getLocalJvms: `${baseUrl}/vm/localJvms`,
  attachLocalJvm: `${baseUrl}/vm/attachLocalJvm`,
  attachRemoteJvm: `${baseUrl}/vm/attachRemoteJvm`,
}

export default systemjvmApi