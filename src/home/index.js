import React, { Component } from 'react';
import { Card, Col, Row, Button, message, Upload } from 'antd';
import InvoiceForm from './components/invoiceForm';
import BlForm from './components/invoiceForm/blForm';
import Custom from './components/invoiceForm/custom';
import './index.scss';

function getBase64(img, callback) {
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result));
	reader.readAsDataURL(img);
  }
  
  function beforeUpload(file) {
	const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
	if (!isJpgOrPng) {
	  message.error('You can only upload JPG/PNG file!');
	}
	const isLt2M = file.size / 1024 / 1024 < 2;
	if (!isLt2M) {
	  message.error('Image must smaller than 2MB!');
	}
	return isJpgOrPng && isLt2M;
  }
export default class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			focusItem: 0,
			tabs: [
				{ tabName: 'Bill of Lading 海运套票', id: 0 },
				{ tabName: 'Receipt 发票', id: 1 },
				{ tabName: '自定义', id: 2 },
			],
			currentIndex: 0,
			imageUrl: ''
		};
	}

	changeLight(type = 0) {
		this.setState({ focusItem: type });
	}

	tabChoiced = (id) => {
		// tab切换到方法
		this.setState({
			currentIndex: id,
			focusItem: id
		});
	}
	beforeUpload = (file) => {
		const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
		if (!isJpgOrPng) {
			message.error('You can only upload JPG/PNG file!');
		}
		const isLt2M = file.size / 1024 / 1024 < 5;
		if (!isLt2M) {
			message.error('Image must smaller than 5MB!');
		}
		return isJpgOrPng && isLt2M;
	};

	handleChange = info => {
		if (info.file.status === 'uploading') {
		  this.setState({ loading: true });
		  return;
		}
		if (info.file.status === 'done') {
		  // Get this url from response in real world.
		  getBase64(info.file.originFileObj, imageUrl =>
			this.setState({
			  imageUrl,
			  loading: false,
			}),
		  );
		}
	  };

	render() {
		let _this = this;
		let isBox1Show = this.state.currentIndex === 0 ? 'block' : 'none';
		let isbox2Show = this.state.currentIndex === 1 ? 'block' : 'none';
		let isbox3Show = this.state.currentIndex === 2 ? 'block' : 'none';
		let tabList = this.state.tabs.map((res, index) => {
			return <div key={index} onClick={this.tabChoiced.bind(_this, res.id)} className={`${"btn"} ${this.state.focusItem === res.id ? "active" : null}`}>{res.tabName}</div>;
		});

		
		  const { imageUrl } = this.state;

		const uploadButton = (
			<div>
				<div
					className={"homeCardUpDateImg"}
				>
					Upload a file
				</div>
			</div>
		);
		return (
			<div className={"home"}>
				<div className={"homeTitle"}>通用票据识别</div>
				<span className={"homeTips"}>支持对多种票据类型（多票据）进行票据切分、票据分类、票据识别，同时可对多种票据检测以及关键信息提取，不限票据类型</span>
				<Card className={"homeCard"} bordered={false}>
					<Row>

						<Col span={12}>
							<Upload
								 name="avatar"
								 listType="picture-card"
								 className="avatar-uploader"
								 showUploadList={false}
								 action="http://1.116.37.178:8090/api/ie"
								 beforeUpload={beforeUpload}
								 onChange={this.handleChange}
							>
								{imageUrl ? (
									<img
										src={imageUrl}

										style={{
											height: "100%",
											width: '100%',
										}}
									/>
								) : (
									uploadButton
								)}
							</Upload>
							<Button htmlType="submit" className={"homeCardSubmit"}>Upload a file</Button>

						</Col>
						<Col span={12}>
							<div id="btnWrapper" className={`${"btnWrapper"} ${this.state.focusItem === 0 ? "btnWrapper1" : ''}`}>
								{tabList}
							</div>
							<div className={"homeContent"}>
								<span className={"homeContentTitle"}>内容输出</span>
								<div style={{ display: isBox1Show }}>
									<BlForm />
								</div>
								<div style={{ display: isbox2Show }}>
									<InvoiceForm />
								</div>
								<div style={{ display: isbox3Show }}>
									<Custom></Custom>
								</div>
							</div>
						</Col>
					</Row>
				</Card>
			</div >
		);
	}
}