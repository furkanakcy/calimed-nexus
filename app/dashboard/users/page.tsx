"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusIcon, SearchIcon, EditIcon, TrashIcon } from "@/components/icons"
import { getUsersFromStorage, deleteUser, type User } from "@/lib/mock-data"
import { UserDialog } from "@/components/user-dialog"

export default function UsersPage() {
  const { user: currentUser, isLoading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push("/login")
    }
    if (!isLoading && currentUser?.role !== "admin") {
      router.push("/dashboard")
    }
  }, [currentUser, isLoading, router])

  useEffect(() => {
    setUsers(getUsersFromStorage())
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDelete = (id: string) => {
    if (id === currentUser?.id) {
      alert("Kendi hesabınızı silemezsiniz!")
      return
    }
    if (confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
      deleteUser(id)
      setUsers(getUsersFromStorage())
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setEditingUser(null)
    setUsers(getUsersFromStorage())
  }

  const getRoleBadge = (role: User["role"]) => {
    const variants = {
      admin: { label: "Admin", className: "bg-purple-50 text-purple-700" },
      technician: { label: "Teknisyen", className: "bg-blue-50 text-blue-700" },
      observer: { label: "Gözlemci", className: "bg-gray-50 text-gray-700" },
    }
    const variant = variants[role]
    return <Badge className={variant.className}>{variant.label}</Badge>
  }

  if (isLoading || !currentUser || currentUser.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B5AA3]"></div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h2>
            <p className="text-gray-600 mt-1">Sistem kullanıcılarını görüntüleyin ve yönetin</p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="bg-[#0B5AA3] hover:bg-[#094a8a]">
            <PlusIcon size={20} />
            Yeni Kullanıcı Ekle
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Kullanıcı adı veya e-posta ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ad Soyad</TableHead>
                    <TableHead>E-posta</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Kayıt Tarihi</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        {searchQuery ? "Arama sonucu bulunamadı" : "Henüz kullanıcı eklenmemiş"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.fullName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>
                          <Badge className={user.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}>
                            {user.isActive ? "Aktif" : "Pasif"}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.createdAt}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                              <EditIcon size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(user.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              disabled={user.id === currentUser.id}
                            >
                              <TrashIcon size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <UserDialog open={dialogOpen} onClose={handleDialogClose} user={editingUser} />
    </DashboardLayout>
  )
}
