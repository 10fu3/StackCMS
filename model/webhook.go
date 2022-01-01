package model

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"net/http"
)

type WebHook struct {
	Id       string `db:"webhook_id"`
	ApiId    string `db:"webhook_api_id"`
	Url      string `db:"webhook_url"`
	Name     string `db:"webhook_name"`
	Secret   string `db:"webhook_secret"`
	IsActive bool   `db:"webhook_is_active"`
}

func generateHmac(msg, key string) string {
	h := hmac.New(sha256.New, []byte(key))
	h.Write([]byte(msg))
	return hex.EncodeToString(h.Sum(nil))
}

func (w *WebHook) Send(value map[string]interface{}) {

	data, err := json.Marshal(value)
	if err != nil {
		return
	}

	req, err := http.NewRequest(
		"POST",
		w.Url,
		bytes.NewBuffer(data),
	)
	if err != nil {
		return
	}
	req.Header.Set("X-STACKCMS-Signature", generateHmac(string(data), w.Secret))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return
	}
	defer resp.Body.Close()
}
