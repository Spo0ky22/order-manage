import React, { memo, useMemo, useState } from 'react';
import { InputNumber, Row, Col, Button, Divider, QRCode, Card } from 'antd';
import Meta from 'antd/es/card/Meta';
import JSZip from 'jszip';

const Qrcode: React.FC = () => {
  const [tableCount, setTableCount] = useState(0);
  const [QRCodeDiv, setQRCodeDiv] = useState<JSX.Element[]>([]);

  const handleGenerate = () => {
    console.log('tableCount:', tableCount);
    const newQRCodeDiv = Array.from({ length: tableCount }).map((_, index) => (
      <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4}>
        <Card title={"Table Number: " + (index + 1)} bordered={true} style={{ width: 210 }}>
          <div id={`qrcode-${index + 1}`}>
            <QRCode value={`http://localhost:3000/order?tableId=${index + 1}`} />
          </div>
        </Card>
      </Col>
    ));
    setQRCodeDiv(newQRCodeDiv);
  }
  const downloadQRCode = () => {
    const zip = new JSZip(); // Create a new instance of JSZip

    for (let i = 1; i <= tableCount; i++) {
      const canvas = document.getElementById(`qrcode-${i}`)?.querySelector<HTMLCanvasElement>('canvas');
      if (canvas) {
        const url = canvas.toDataURL();

        // Add the canvas image data to the zip file
        zip.file(`table-${i}.png`, url.split(',')[1], { base64: true });
      }
    }

    // Generate the zip file
    zip.generateAsync({ type: 'blob' }).then((content) => {
      // Create a temporary link to download the zip file
      const a = document.createElement('a');
      a.download = 'qrcodes.zip';
      a.href = URL.createObjectURL(content);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };
  return (
    <>
      <div className="box-style searchbar">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p style={{ paddingRight: 20 }}>Please enter table number:</p>
          <InputNumber style={{ marginRight: 20 }} min={1} value={tableCount || 0} onChange={(value) => setTableCount(value || 0)} placeholder="Enter table count" />
          <Button type='primary' onClick={handleGenerate}>Generate QRCode</Button>
        </div>
      </div>

      <div className="box-style">
        <Row justify='space-between'>
          <Col><h3>QRCode Display</h3></Col>
          <Col><Button type='primary' onClick={downloadQRCode}>Download QRCode</Button></Col>
        </Row>
        <Divider></Divider>
        <Row gutter={[24, 24]}>
          {QRCodeDiv}
        </Row>
      </div>
    </>
  );
};

export default memo(Qrcode);