import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useAddressStore = defineStore('address', () => {
  // 初始地址列表，可替换为接口获取
  const addresses = ref([
    {
      id: 1,
      name: '阿呆',
      phone: '1XXXXXXXX65',
      region: '广东省 深圳市 宝安区',
      detail: 'XXXXXXXXXXXX',
      isDefault: true
    },
    {
      id: 2,
      name: '亮',
      phone: '1XXXXXXXX65',
      region: '广东省 深圳市 龙华区',
      detail: 'XXXXXXXXXXXX',
      isDefault: false
    },
    {
      id: 3,
      name: '泳',
      phone: '1XXXXXXXX65',
      region: '广东省 深圳市 龙岗区',
      detail: 'XXXXXXXXXXXX',
      isDefault: false
    },
    {
      id: 4,
      name: '艺',
      phone: '1XXXXXXXX65',
      region: '广东省 深圳市 龙岗区',
      detail: 'XXXXXXXXXXXX',
      isDefault: false
    }
  ])

  // 监听并缓存到本地
  watch(addresses, (val) => {
    uni.setStorage({ key: 'addresses', data: JSON.stringify(val) })
  }, { deep: true })

  /**
   * 添加地址
   */
  const addAddress = (addr) => {
    const newId = Date.now()
    const newAddr = { ...addr, id: newId, checked: false }
    addresses.value.push(newAddr)
    if (newAddr.isDefault) {
      setDefault(newId)
    }
    return newId
  }

  /**
   * 更新地址
   */
  const updateAddress = (addr) => {
    const idx = addresses.value.findIndex(a => a.id === addr.id)
    if (idx > -1) {
      addresses.value[idx] = { ...addr }
      if (addr.isDefault) {
        setDefault(addr.id)
      }
    }
  }

  /**
   * 删除地址
   */
  const deleteAddress = (id) => {
    const idx = addresses.value.findIndex(a => a.id === id)
    if (idx > -1) addresses.value.splice(idx, 1)
  }

  /**
   * 设置默认地址
   */
  const setDefault = (id) => {
    addresses.value.forEach(a => (a.isDefault = a.id === id))
  }

  return {
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefault
  }
}) 