package model

type AuthType struct {
	IsUser   bool
	AuthInfo interface{}
}

func (a *AuthType) GetUser() *User {
	if r, ok := a.AuthInfo.(*User); ok {
		return r
	}
	return nil
}

func (a *AuthType) GetClient() *Client {
	if r, ok := a.AuthInfo.(*Client); ok {
		return r
	}
	return nil
}

type ResultCount struct {
	Offset int64
	Limit  int64
}

type SortOrder string

type OrderRequest struct {
	Field      string
	Descending bool
}

type GetQuery struct {
	Count    ResultCount
	ApiId    string
	Filter   map[string]interface{}
	Fields   map[string]bool
	GetMeta  bool
	GetDraft bool
	Depth    int
	Order    []OrderRequest
}
