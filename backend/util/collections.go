package util

//func MapFunc(list interface{}, comp func(e interface{}) interface{}) {
//	listV := reflect.ValueOf(list)
//	if listV.Kind() == reflect.Slice {
//		for i := 0; i < listV.Len(); i++ {
//			item := listV.Index(i).Interface()
//			comp(item)
//		}
//	}
//}

func StringSliceToBooleanMap(l []string) map[string]bool {
	r := map[string]bool{}
	for _, k := range l {
		r[k] = true
	}
	return r
}
