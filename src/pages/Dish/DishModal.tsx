import React, { useState, ReactNode, useEffect } from 'react'
import { Form, Input, InputNumber, Modal, Switch, Upload, message } from 'antd'
import type { GetProp, UploadProps } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import TextArea from 'antd/es/input/TextArea'
import { useAppDispatch, useAppSelector } from '../../tools/store'
import { closeDishModal, getDishList } from '../../tools/store/actions'
import { addDish, editDish } from '../../tools/api'
import RestaurantSelector from '../../components/RestaurantSelector'
import useHandleResponse from '../../hooks/useMessage'

interface IProps {
  children?: ReactNode
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const DishModal: React.FC<IProps> = () => {
  const [restaurantValue, setRestaurantValue] = useState<number | undefined>(undefined)
  const [uploadLoading, setuploadLoading] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [image, setImage] = useState<File>()
  const [imageUrl, setImageUrl] = useState<string | undefined>()
  const [form] = Form.useForm()

  const handleResponse = useHandleResponse()

  const { isModalOpen, type, dishRecord, searchValue, page } = useAppSelector((state) => state.dish)
  const { list } = useAppSelector((state) => state.restaurant)

  const dispatch = useAppDispatch()

  // 给form表单赋初值
  useEffect(() => {
    // 给form表单赋初始值

    if (dishRecord) {
      form.setFieldsValue({
        name: dishRecord.name,
        restaurantId: Number(dishRecord.restaurantId),
        category: dishRecord.category,
        price: dishRecord.price,
        // img: dishRecord.img,
        available: dishRecord.available,
        description: dishRecord.description,
      })
      setImageUrl(dishRecord.img)
      // setImage(dishRecord.img)
      setRestaurantValue(Number(dishRecord.restaurantId))
      console.log('餐厅id:', dishRecord, typeof restaurantValue)
    }
    if (type === 'add' && list.length > 0 && localStorage.getItem('username') !== 'admin') {
      setRestaurantValue(Number(list[0].id))
      form.setFieldValue('restaurantId', Number(list[0].id))
    }
  }, [dishRecord, form])

  const handleOk = async () => {
    try {
      setIsLoading(true)
      const { name, description, restaurantId, img, available, category, price } = await form.validateFields()
      if (type === 'add') {
        const res: any = await addDish({ name, description, restaurantId, img: image, available, category, price })
        console.log('res', res)
        handleResponse(res, 'Add Success!', 'Add Failed!')
      } else {
        const res: any = await editDish({ id: dishRecord?.id, name, restaurantId, description, available, img: image, category, price })
        console.log('img:', image)
        handleResponse(res, 'Edit Success!', 'Edit Failed!')
      }
      setIsLoading(false)
      dispatch(
        getDishList({
          pageNum: type === 'add' ? 1 : page.pageNum ?? 1,
          pageSize: 10,
          name: searchValue?.name,
          category: searchValue?.category,
          restaurantId: searchValue?.restaurantId,
        })
      )
      dispatch(closeDishModal())
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }
  const handleCancel = () => {
    dispatch(closeDishModal())
    console.log('dish cancel')
  }

  // 选择餐厅处理函数
  const handleSelectChange = (value: any, option: any) => {
    setRestaurantValue(value)
    // 将选中的标签值设置到表单中
    form.setFieldsValue({ restaurantId: value })
  }

  const handleChange: UploadProps['onChange'] = (info) => {
    // if (info.file.status === 'uploading') {
    //   setuploadLoading(true);
    //   // return;
    // }
    // if (info.file.status === 'done') {
    // setuploadLoading(false);
    // 从 info.fileList 中获取原生的 File 对象
    if (!info) return
    if (!info.file) {
      return
    }

    if (Array.isArray(info.fileList) && info.fileList.length > 0) {
      const originFileObj = info.fileList.find((file) => file?.uid === info.file.uid)?.originFileObj

      if (originFileObj) {
        const imageUrl = URL.createObjectURL(originFileObj)
        console.log('imageUrl:', imageUrl)
        setImageUrl(imageUrl)
      }
    }
    // }
  }
  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!')
    }
    if (isJpgOrPng && isLt2M) {
      setImage(file)
    }
    // 阻止文件的默认上传行为
    return false
  }

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  )

  return (
    <>
      <Modal title={(type === 'add' ? 'Add' : 'Edit') + ' Dish'} open={isModalOpen} onOk={handleOk} confirmLoading={isLoading} onCancel={handleCancel} width={600}>
        <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} layout="horizontal" style={{ maxWidth: 1000, margin: '30px' }}>
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Input />
          </Form.Item>
          <Form.Item label="Restaurant" name="restaurantId">
            <RestaurantSelector selectedValues={restaurantValue} onSelectChange={handleSelectChange} />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <TextArea placeholder="Please enter a description" autoSize={{ minRows: 3, maxRows: 5 }} />
          </Form.Item>
          <Form.Item label="Price" name="price">
            <InputNumber prefix="$" defaultValue={1} min={0.0} step="0.1" />
          </Form.Item>
          <Form.Item label="Available" valuePropName="checked" name="available">
            <Switch />
          </Form.Item>
          <Form.Item
            label="Upload"
            valuePropName="fileList"
            name="img"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e
              }
              return e && e.fileList
            }}
          >
            <Upload name="Picture" listType="picture-card" className="avatar-uploader" showUploadList={false} onChange={handleChange} beforeUpload={beforeUpload}>
              {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default DishModal
