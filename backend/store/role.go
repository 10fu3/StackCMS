package store

import (
	"StackCMS/Setup"
	"StackCMS/model"
)

type Roles interface {
	GetAllRole() []model.Role
	CreateRole(role model.Role)
	UpdateRole(role model.Role)
	DeleteRole(role model.Role)
}

func (d *Db) GetAllRole() []model.Role {
	var r []model.Role
	if err := d.Db.Ping(); err != nil {
		d.Db.Close()
		if err = Setup.SetupDb(); err != nil {
			return r
		}
	}
	d.Db.Select(&r, "SELECT * FROM roles")
	return r
}

func (d *Db) GetRole(roleId string) *model.Role {
	if err := d.Db.Ping(); err != nil {
		d.Db.Close()
		if err = Setup.SetupDb(); err != nil {
			return nil
		}
	}
	var r model.Role
	if d.Db.Get(&r, "SELECT * FROM roles WHERE role_id = ?", roleId) != nil {
		return nil
	}
	return &r
}

func (d *Db) CreateRole(role model.Role) {
	if err := d.Db.Ping(); err != nil {
		d.Db.Close()
		if err = Setup.SetupDb(); err != nil {
			return
		}
	}
	d.Db.Exec("INSERT INTO roles (role_id,role_name,is_lock) VALUES (?,?,?)", role.Id, role.Name, false)
}

func (d *Db) UpdateRole(role model.Role) {
	if err := d.Db.Ping(); err != nil {
		d.Db.Close()
		if err = Setup.SetupDb(); err != nil {
			return
		}
	}
	d.Db.Exec("UPDATE roles SET role_name = ? WHERE role_id = ? AND is_lock = false", role.Name, role.Id)
	d.LeaveAbilitiesByRoleId(&role)
	d.AppendAbilities(role, role.Abilities)
}

func (d *Db) DeleteRole(role model.Role) {
	if err := d.Db.Ping(); err != nil {
		d.Db.Close()
		if err = Setup.SetupDb(); err != nil {
			return
		}
	}
	d.Db.Exec("DELETE FROM roles WHERE role_id = ? AND is_lock = false", role.Id)
	d.LeaveAbilitiesByRoleId(&role)
}
