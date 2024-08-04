interface Window {
  // 拓展高德地图的配置
  _AMapSecurityConfig: {
    securityJsCode: string
  }
}
type QCType = {
  Login: {
    check(): boolean // 判断有没有使用qq登录过
    getMe(cb: (openId: string) => void): void
  }
}

declare const QC: QCType
