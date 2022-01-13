package store

import "StackCMS/model"

type Roles interface {
	GetAllRole() []model.Role
	CreateRole(role model.Role)
	UpdateRole(role model.Role)
	DeleteRole(role model.Role)
}

func (d *Db) GetAllRole() []model.Role {
	var r []model.Role
	d.Db.Select(&r, "SELECT * FROM roles")
	return r
}

func (d *Db) GetRole(roleId string) *model.Role {
	var r model.Role
	if d.Db.Get(&r, "SELECT * FROM roles WHERE role_id = ?", roleId) != nil {
		return nil
	}
	return &r
}

func (d *Db) CreateRole(role model.Role) {
	d.Db.Exec("INSERT INTO roles (role_id,role_name,is_lock) VALUES (?,?,?)", role.Id, role.Name, false)
}

func (d *Db) UpdateRole(role model.Role) {
	d.Db.Exec("UPDATE roles SET role_name = ? WHERE role_id = ? AND is_lock = false", role.Name, role.Id)
	d.LeaveAbilitiesByRoleId(&role)
	d.AppendAbilities(role, role.Abilities)
}

func (d *Db) DeleteRole(role model.Role) {
	d.Db.Exec("DELETE FROM roles WHERE role_id = ? AND is_lock = false", role.Id)
	d.LeaveAbilitiesByRoleId(&role)
}
