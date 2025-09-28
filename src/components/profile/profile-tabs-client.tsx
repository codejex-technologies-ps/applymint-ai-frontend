'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, FileText, Download } from 'lucide-react'

interface ProfileTabsClientProps {
  personalInfoTab: React.ReactNode
  resumeBuilderTab: React.ReactNode
  exportImportTab: React.ReactNode
}

export function ProfileTabsClient({ 
  personalInfoTab, 
  resumeBuilderTab, 
  exportImportTab 
}: ProfileTabsClientProps) {
  const [activeTab, setActiveTab] = useState('personal')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="personal" className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span>Personal Info</span>
        </TabsTrigger>
        <TabsTrigger value="resume" className="flex items-center space-x-2">
          <FileText className="h-4 w-4" />
          <span>Resume Builder</span>
        </TabsTrigger>
        <TabsTrigger value="export" className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Export & Import</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="personal" className="space-y-6">
        {personalInfoTab}
      </TabsContent>

      <TabsContent value="resume" className="space-y-6">
        {resumeBuilderTab}
      </TabsContent>

      <TabsContent value="export" className="space-y-6">
        {exportImportTab}
      </TabsContent>
    </Tabs>
  )
}