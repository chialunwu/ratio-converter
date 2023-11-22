import React, { useState, useMemo, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { Scissors } from "react-bootstrap-icons";

import _ from "lodash";

function RatioTool() {
  const [originalRatio, setOriginalRatio] = useState(1000);
  const [newRawRatio, setNewRawRatio] = useState(50);
  const [copied, setCopied] = useState(false);
  const numZeros = useMemo(
    () =>
      Array.from(String(originalRatio))
        .reverse()
        .findIndex((v) => v !== "0"),
    [originalRatio, newRawRatio]
  );
  const newRawSnappedRatio = useMemo(
    () => (originalRatio / Number(newRawRatio)) * 100,
    [originalRatio, newRawRatio]
  );
  const numUsedZeros = useMemo(() => {
    const numDigits = String(_.round(newRawSnappedRatio)).length;
    return Math.min(numZeros, numDigits - 1);
  }, [newRawSnappedRatio, numZeros]);
  const finalSnappedRatio = useMemo(
    () => _.round(newRawSnappedRatio, -numUsedZeros),
    [newRawSnappedRatio, numUsedZeros]
  );
  const answer = useMemo(
    () => _.round((originalRatio / finalSnappedRatio) * 100, 4),
    [originalRatio, finalSnappedRatio]
  );
  const handleCopy = () => {
    navigator.clipboard.writeText(answer);
    setCopied(true);
  };

  useEffect(() => {
    setCopied(false);
  }, [answer]);

  return (
    <>
      <Modal.Body>
        <InputGroup className="mb-3">
          <InputGroup.Text>1 : </InputGroup.Text>
          <Form.Control
            value={originalRatio}
            onChange={(v) => setOriginalRatio(v.target.value)}
            type="number"
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>想縮放</InputGroup.Text>
          <Form.Control
            value={newRawRatio}
            onChange={(v) => setNewRawRatio(v.target.value)}
            type="number"
          />
          <InputGroup.Text>%</InputGroup.Text>
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">會變成</InputGroup.Text>
          <InputGroup.Text id="basic-addon1">
            {Number.isFinite(newRawSnappedRatio)
              ? `1 : ${newRawSnappedRatio}`
              : ""}
          </InputGroup.Text>
        </InputGroup>
        <hr />
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">要變成</InputGroup.Text>
          <InputGroup.Text id="basic-addon1">
            {Number.isFinite(finalSnappedRatio)
              ? `1 : ${finalSnappedRatio}`
              : ""}
          </InputGroup.Text>
          <InputGroup.Text id="basic-addon1">的話</InputGroup.Text>
        </InputGroup>
        <InputGroup className="mb-3" size="lg">
          <InputGroup.Text>應該縮放</InputGroup.Text>
          <InputGroup.Text>
            <b>{answer || ""}</b>
          </InputGroup.Text>
          <InputGroup.Text style={{ cursor: "pointer" }} onClick={handleCopy}>
            <Scissors /> {copied ? "(已複製)" : ""}
          </InputGroup.Text>
        </InputGroup>
      </Modal.Body>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <RatioTool />
        </div>
      </header>
    </div>
  );
}

export default App;
