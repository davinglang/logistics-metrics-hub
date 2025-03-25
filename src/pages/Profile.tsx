
import React, { useContext, useEffect } from 'react'
import { Layout, DashboardContext } from '@/components/dashboard/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const Profile = () => {
  // Set the active section to null when on the profile page
  const { setActiveSection } = useContext(DashboardContext)
  
  useEffect(() => {
    // This will help visually indicate we're not on a dashboard section
    setActiveSection('')
    
    // Cleanup when component unmounts
    return () => {
      setActiveSection('dailyreports')
    }
  }, [setActiveSection])

  return (
    <Layout>
      <div className="container max-w-4xl animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and profile picture</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src="/avatar.png" alt="Profile" />
                    <AvatarFallback className="text-2xl">LS</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">Change Picture</Button>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="Logistics" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Supervisor" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="logistics@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input id="position" defaultValue="Logistics Manager" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How we can reach you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue="+33 123 456 789" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Office Location</Label>
                  <Input id="address" defaultValue="Paris HQ, Building 4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Profile
