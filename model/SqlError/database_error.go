package SqlError

type Error uint16

var DuplicateEntry Error = 1062

func (e Error) Raw() uint16 {
	return uint16(e)
}
