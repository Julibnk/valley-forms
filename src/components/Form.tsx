import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

import {
  CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Plus,
  Trash2,
} from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { Calendar } from './ui/calendar';

import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { Activity } from '../../amplify/data/Booking/Activity';

const client = generateClient<Schema>();

export default function Form() {
  const signatureRef = useRef<SignatureCanvas>(null);
  const [booking, setBooking] = useState<Schema['Booking']['createType']>({
    activity: null,
    date: new Date().toISOString(),
    pdfUrl: '',
  });

  const [customers, setCustomers] = useState<
    Array<Schema['Customer']['createType']>
  >([{ name: '', surname: '', dni: '' }]);
  const [currentCustomer, setCurrentCustomer] = useState(0);

  const handleClear = () => {
    signatureRef.current?.clear();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    toast.success('Form submitted');
    client.models.Booking.create({
      activity: booking.activity,
      date: booking.date,
      pdfUrl: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf',
    });
    // client.models.Customer.create({
    //   name: customers[0].name,
    //   birthdate: customers[0].birthdate,
    //   dni: customers[0].dni,
    // });
    console.log('Form submitted', customers);
  };

  const addCustomer = () => {
    setCustomers([...customers, { name: '', surname: '', dni: '' }]);
    setCurrentCustomer(customers.length);
  };

  const updateCustomer = (field: string, value: string | null) => {
    const updatedCustomers = [...customers];
    updatedCustomers[currentCustomer] = {
      ...updatedCustomers[currentCustomer],
      [field]: value,
    };
    setCustomers(updatedCustomers);
  };

  const deleteCustomer = () => {
    if (customers.length > 1) {
      const newCustomers = customers.filter(
        (_, index) => index !== currentCustomer
      );
      setCustomers(newCustomers);
      setCurrentCustomer((prev) =>
        prev >= newCustomers.length ? newCustomers.length - 1 : prev
      );
    }
  };

  const [showTerms, setShowTerms] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  return (
    <Card>
      <CardHeader className='px-7'>
        <CardTitle>Confirmación actividad</CardTitle>
        <CardDescription>
          Añada a todas las personas que van a participar
        </CardDescription>
      </CardHeader>
      <CardContent className='px-8'>
        <form onSubmit={handleSubmit} id='booking-form' className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='activity'>Actividad:</Label>
            <Select
              required
              onValueChange={(value) =>
                setBooking((state) => ({
                  ...state,
                  activity: value as Activity,
                }))
              }
            >
              <SelectTrigger id='activity'>
                <SelectValue placeholder='Seleccione una actividad' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Activity.BARRANCOS}>Barrancos</SelectItem>
                <SelectItem value={Activity.LAGOS}>Lagos</SelectItem>
                <SelectItem value={Activity.DESCENSO_SELLA}>
                  Descenso del Sella
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='flex flex-col space-y-2'>
            <Label htmlFor='birthdate'>Fecha de realización:</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'justify-start text-left font-normal',
                    booking.date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {booking.date ? (
                    format(booking.date, 'PPP')
                  ) : (
                    <span>Elija una fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0'>
                <Calendar
                  mode='single'
                  selected={booking.date ? new Date(booking.date) : new Date()}
                  onSelect={(e) =>
                    e &&
                    setBooking((state) => ({
                      ...state,
                      date: e.toISOString().split('T')[0],
                    }))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Formulario cliente */}
          <div className='space-y-4 p-4 border rounded-md bg-muted/50'>
            {/* Header */}
            <div className='flex justify-between items-center'>
              <h3 className='font-semibold'>
                Cliente {currentCustomer + 1} de {customers.length}
              </h3>
              <div className='space-x-2'>
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  onClick={() =>
                    setCurrentCustomer((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentCustomer === 0}
                >
                  <ChevronLeft className='h-4 w-4' />
                  <span className='sr-only'>Anterior</span>
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  onClick={() =>
                    setCurrentCustomer((prev) =>
                      Math.min(customers.length - 1, prev + 1)
                    )
                  }
                  disabled={currentCustomer === customers.length - 1}
                >
                  <ChevronRight className='h-4 w-4' />
                  <span className='sr-only'>Siguiente cliente</span>
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  onClick={addCustomer}
                >
                  <Plus className='h-4 w-4' />
                  <span className='sr-only'>Añadir cliente</span>
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  onClick={deleteCustomer}
                  disabled={customers.length === 1}
                >
                  <Trash2 className='h-4 w-4' />
                  <span className='sr-only'>Borrar cliente</span>
                </Button>
              </div>
            </div>

            {/* Formulario */}
            <div className='space-y-2'>
              <Label htmlFor='name'>Nombre:</Label>
              <Input
                id='name'
                value={customers[currentCustomer].name || ''}
                onChange={(e) => updateCustomer('name', e.target.value)}
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='dni'>DNI:</Label>
              <Input
                id='dni'
                value={customers[currentCustomer].dni || ''}
                onChange={(e) => updateCustomer('dni', e.target.value)}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label>Firma:</Label>
              <div className='border border-input rounded-md p-2 bg-background'>
                <SignatureCanvas
                  ref={signatureRef}
                  canvasProps={{
                    className: 'w-full h-40 bg-background',
                  }}
                />
              </div>
              <Button
                type='button'
                variant='outline'
                className='w-full mt-2'
                onClick={handleClear}
              >
                Limpiar firma
              </Button>
            </div>

            {/* Header */}
            <div className='flex justify-between items-center'>
              <h3 className='font-semibold'>
                Cliente {currentCustomer + 1} de {customers.length}
              </h3>
              <div className='space-x-2'>
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  onClick={() =>
                    setCurrentCustomer((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentCustomer === 0}
                >
                  <ChevronLeft className='h-4 w-4' />
                  <span className='sr-only'>Anterior</span>
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  onClick={() =>
                    setCurrentCustomer((prev) =>
                      Math.min(customers.length - 1, prev + 1)
                    )
                  }
                  disabled={currentCustomer === customers.length - 1}
                >
                  <ChevronRight className='h-4 w-4' />
                  <span className='sr-only'>Siguiente cliente</span>
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  onClick={addCustomer}
                >
                  <Plus className='h-4 w-4' />
                  <span className='sr-only'>Añadir cliente</span>
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  onClick={deleteCustomer}
                  disabled={customers.length === 1}
                >
                  <Trash2 className='h-4 w-4' />
                  <span className='sr-only'>Borrar cliente</span>
                </Button>
              </div>
            </div>
          </div>

          <div className='space-y-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setShowTerms(!showTerms)}
              className='w-full flex justify-between items-center'
            >
              <span>Terms and Conditions</span>
              {showTerms ? (
                <ChevronUp className='h-4 w-4' />
              ) : (
                <ChevronDown className='h-4 w-4' />
              )}
            </Button>
            {showTerms && (
              <div className='p-4 bg-muted/50 rounded-md text-sm max-h-40 overflow-y-auto'>
                <p>
                  By participating in this activity, you agree to the following
                  terms and conditions:
                </p>
                <ol className='list-decimal pl-5 mt-2 space-y-2'>
                  <li>
                    You understand and accept the risks associated with the
                    chosen activity.
                  </li>
                  <li>
                    You confirm that all provided information is accurate and
                    up-to-date.
                  </li>
                  <li>
                    You agree to follow all safety instructions given by the
                    activity organizers.
                  </li>
                  <li>
                    You acknowledge that the organizers reserve the right to
                    cancel or modify the activity due to unforeseen
                    circumstances.
                  </li>
                  <li>
                    You grant permission for the use of photographs or videos
                    taken during the activity for promotional purposes.
                  </li>
                </ol>
              </div>
            )}
          </div>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='terms'
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
              required
            />
            <Label
              htmlFor='terms'
              className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              I accept the terms and conditions
            </Label>
          </div>
        </form>
      </CardContent>
      <CardFooter className='bg-primary/5 p-6'>
        <Button
          type='submit'
          formTarget='booking-form'
          className='w-full bg-primary text-primary-foreground hover:bg-primary/90'
        >
          Confirmar actividad
        </Button>
      </CardFooter>
    </Card>
  );
}
