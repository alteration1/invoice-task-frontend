import React, { useState } from 'react'
import { message, Form, Input, Row, Col, Button, Upload, Space } from 'antd'
import client from '../client'
import { UploadOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const CalculateForm = (props) => {
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState([])
    const [outCurrency, setOutCurrency] = useState([])


    const onFinish = (values) => {
        setLoading(true)
        values.file = values.file.file
        let body = new FormData();
        body.append('file', values.file)
        body.append('exchangerates', JSON.stringify(values.exchangerates))
        body.append('outcurrency', values.outcurrency.trim())
        setOutCurrency(values.outcurrency)
        if(values.vat){
            body.append('vat', values.vat.trim())
        }

        client
            .post('/api/calculate/invoices', body, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                setLoading(false)
                if (response.data && response.data.total) {
                    console.log(response.data.total)
                    setTotal(response.data.total)
                }
            })
            .catch(error => {
                let errorMessage = 'Some error occured!'
                if (error.response && error.response.data && error.response.data.error) {
                    errorMessage = error.response.data.error;
                }
                message.error(errorMessage, 5);
                setLoading(false)
            })
    }

    return (<>
        <Row gutter={[24, 48]} className="register-form">
            <Col span={12} offset={6}>
                <h3>Calculate</h3>
            </Col>
        </Row>
        <Row gutter={[24, 48]}>
            <Col span={8} offset={6}>
                <Form
                    name="register"
                    onFinish={onFinish}
                    layout="vertical">
                    <Form.Item
                        required
                        name="file"
                        label="Upload file"
                        rules={[{
                            required: true,
                            message: 'Please, upload your file!'
                        }]}
                    >
                        <Upload
                            beforeUpload={() => false}
                            multiple={false}
                            accept="text/csv, .csv"
                            maxCount={1}>
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>
                    <Form.List name="exchangerates"
                        initialValue={[{ 'currency': 'EUR', 'rates': 1 }]}>
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(field => (
                                    <Space key={field.key} align="baseline">
                                        <Form.Item
                                            noStyle
                                            shouldUpdate={(prevValues, curValues) =>
                                                prevValues.area !== curValues.area || prevValues.exchangerates !== curValues.exchangerates
                                            }
                                        >
                                            {() => (
                                                <Form.Item
                                                    {...field}
                                                    label="Currency"
                                                    name={[field.name, 'currency']}
                                                    rules={[{ required: true, message: 'Missing currency' }]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            )}
                                        </Form.Item>
                                        <Form.Item
                                            {...field}
                                            label="Exchange rates"
                                            name={[field.name, 'rates']}
                                            rules={[{ required: true, message: 'Missing rates' }]}
                                        >
                                            <Input />
                                        </Form.Item>

                                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                                    </Space>
                                ))}

                                <Form.Item>
                                    <Button
                                        size="small"
                                        type="dashed"
                                        onClick={() => add()}
                                        block
                                        icon={<PlusOutlined />}>
                                        Add cource
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                    <Form.Item
                        required
                        name="outcurrency"
                        label="Output currency"
                        rules={[
                            {
                                required: true,
                                message: 'Please input output currency!',
                            },
                        ]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="vat"
                        label="Client VAT"
                    >
                        <Input />
                    </Form.Item>
                    <Button size="large" loading={loading} htmlType="submit" >Calculate</Button>
                </Form>
            </Col>
        </Row>
        {total && <Row className="register-form">
            {Object.keys(total).map(key => (
                <Col span={12} offset={6}>
                    <h3><span>{key}: </span>{total[key]+' '+outCurrency}</h3>
                </Col>
            ))}
        </Row>}
    </>
    )
}

export default CalculateForm;