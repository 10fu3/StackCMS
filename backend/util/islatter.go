package util

func IsLetter(s string) bool {
	for _, r := range s {
		if r == '_' || r == '-' {
			continue
		}
		if r == ' ' {
			return false
		}
		if (r < 'a' || r > 'z') && (r < 'A' || r > 'Z') && (r < '0' || r > '9') {
			return false
		}
	}
	return true
}
