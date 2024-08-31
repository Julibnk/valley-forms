import Form from './components/Form';
import './App.css';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { BookingTable } from './components/BookingTable';
function App() {
  const [activeTab, setActiveTab] = useState('table');
  return (
    <div className='app min-h-screen bg-gradient-to-b from-primary/10 to-background flex justify-center py-8'>
      {/* <div className='app min-h-screen bg-gradient-to-b from-primary/10 to-background bg-[url("/images/Lagos2.jpg")] bg-cover bg-center bg-no-repeat'> */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className='w-full max-w-3xl mx-auto '
      >
        <TabsList className='grid w-full grid-cols-2 rounded-lg border shadow-sm'>
          <TabsTrigger value='form'>Confirmación</TabsTrigger>
          <TabsTrigger value='table'>Historico</TabsTrigger>
        </TabsList>
        <TabsContent value='form'>
          <Form />
        </TabsContent>
        <TabsContent value='table'>
          <BookingTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;
