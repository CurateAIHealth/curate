'use client'
import { useState } from 'react';

const FingerprintScanner = () => {
  const [status, setStatus] = useState('Idle');
  const [fingerprintData, setFingerprintData] = useState(null);
  const [error, setError] = useState(null);

  const captureFingerprint = async () => {
    setStatus('Attempting to connect to device...');
    setError(null);
    setFingerprintData(null);

    try {
      // Step 1: Discover device (optional, but good for error handling)
      const deviceInfoResponse = await fetch('http://127.0.0.1:11100/rd/info', {
        method: 'DEVICEINFO', // Specific method for RD Service
        headers: {
          'Content-Type': 'application/xml', // Or application/json, check Mantra docs
          'Accept': 'application/xml', // Or application/json
        },
        // You might need to send an empty body or specific XML/JSON for info
        body: '<DeviceInfo><PidOptions ver="1.0" /><BioType><Type value="FMR" /></BioType></DeviceInfo>'
      });

      if (!deviceInfoResponse.ok) {
        throw new Error(`Device info failed: ${deviceInfoResponse.statusText}`);
      }
      const deviceInfoText = await deviceInfoResponse.text();
      console.log('Device Info:', deviceInfoText);
      // Parse deviceInfoText to confirm device readiness if needed

      setStatus('Please place your finger on the scanner...');

      // Step 2: Initiate Capture
      const captureResponse = await fetch('http://127.0.0.1:11100/rd/capture', {
        method: 'CAPTURE', // Specific method for RD Service
        headers: {
          'Content-Type': 'application/xml', // Or application/json
          'Accept': 'application/xml', // Or application/json
        },
        // The body structure depends on Mantra's RD Service API documentation
        // This is a simplified example, refer to Mantra's actual PID Options XML/JSON
        body: `
          <PidOptions ver="2.0">
            <Opts fCount="1" fType="0" iCount="0" pCount="0" format="0" pidVer="2.0" timeout="10000" posh="UNKNOWN" env="P" />
          </PidOptions>
        `,
      });

      if (!captureResponse.ok) {
        throw new Error(`Capture failed: ${captureResponse.statusText}`);
      }

      const captureData = await captureResponse.text(); // Or .json() if response is JSON
      console.log('Capture Response:', captureData);

      // Parse the XML/JSON response to extract the fingerprint data
      // For example, if it's XML, you'd parse it to get the PID data block
      // Example (simplified):
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(captureData, 'text/xml');
      const pidDataElement = xmlDoc.getElementsByTagName('Data')[0]; // Assuming 'Data' tag contains the PID block
      const capturedPidData:any = pidDataElement ? pidDataElement.textContent : 'No PID data found';

      setFingerprintData(capturedPidData);
      setStatus('Fingerprint captured successfully!');

      // Step 3: Send to your Next.js backend for further processing
      // Example:
      // await fetch('/api/verify-fingerprint', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ pidData: capturedPidData }),
      // });

    } catch (err:any) {
      console.error('Error capturing fingerprint:', err);
      setError(err.message);
      setStatus('Error during fingerprint capture.');
    }
  };

  return (
    <div>
      <h1>Mantra MFS100 Fingerprint Capture</h1>
      <button onClick={captureFingerprint} disabled={status === 'Please place your finger on the scanner...'}>
        Capture Fingerprint
      </button>
      <p>Status: {status}</p>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {fingerprintData && (
        <div>
          <h2>Captured Fingerprint Data (PID Block):</h2>
          <textarea readOnly value={fingerprintData} ></textarea>
          <p>This data should be sent to your backend for secure processing/verification.</p>
        </div>
      )}
    </div>
  );
};

export default FingerprintScanner;