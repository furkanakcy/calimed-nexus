"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { addUser, updateUser, type User } from "@/lib/mock-data"

interface UserDialogProps {
  open: boolean
  onClose: () => void
  user?: User | null
}

export function UserDialog({ open, onClose, user }: UserDialogProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "observer" as User["role"],
    isActive: true,
  })

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      })
    } else {
      setFormData({
        fullName: "",
        email: "",
        role: "observer",
        isActive: true,
      })
    }
  }, [user, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (user) {
      updateUser(user.id, formData)
    } else {
      addUser(formData)
    }

    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{user ? "Kullanıcı Düzenle" : "Yeni Kullanıcı Ekle"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Ad Soyad *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-posta *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rol *</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value as User["role"] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="technician">Teknisyen</SelectItem>
                <SelectItem value="observer">Gözlemci</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              {formData.role === "admin" && "Tüm yetkilere sahip"}
              {formData.role === "technician" && "Cihaz ve kalibrasyon yönetimi"}
              {formData.role === "observer" && "Sadece görüntüleme yetkisi"}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Aktif Kullanıcı</Label>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit" className="bg-[#0B5AA3] hover:bg-[#094a8a]">
              {user ? "Güncelle" : "Ekle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
