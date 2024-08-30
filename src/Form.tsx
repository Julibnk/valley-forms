import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
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
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Plus,
  Trash2,
} from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';

export default function Form() {
  const signatureRef = useRef<SignatureCanvas>(null);
  const [customers, setCustomers] = useState([
    { name: '', birthdate: '', dni: '', signature: null },
  ]);
  const [currentCustomer, setCurrentCustomer] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleClear = () => {
    signatureRef.current?.clear();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';
      }
    }
  }, [currentCustomer]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submitted', customers);
  };

  const addCustomer = () => {
    setCustomers([
      ...customers,
      { name: '', birthdate: '', dni: '', signature: null },
    ]);
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

  enum Activity {
    BARRANCOS = 'Barrancos',
    LAGOS = 'Lagos',
    DESCENSO_SELLA = 'Descenso del Sella',
    RUTA_CARES = 'Ruta del Cares',
  }

  return (
    <Card className='w-full max-w-2xl'>
      <CardHeader className='border-b'>
        <CardTitle className='text-2xl text-center text-primary'>
          Confirmación actividad
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className='space-y-6 p-6'>
          <div className='space-y-2'>
            <Label htmlFor='activity'>Seleccion de actividad</Label>
            <Select required>
              <SelectTrigger id='activity'>
                <SelectValue placeholder='Elija una atividad' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Activity.BARRANCOS}>Barrancos</SelectItem>
                <SelectItem value={Activity.LAGOS}>Lagos</SelectItem>
                <SelectItem value={Activity.DESCENSO_SELLA}>
                  Descenso del Sella
                </SelectItem>
                <SelectItem value={Activity.RUTA_CARES}>
                  Ruta del Cares
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-4 p-4 border rounded-md bg-muted/50'>
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
            <div className='space-y-2'>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                value={customers[currentCustomer].name}
                onChange={(e) => updateCustomer('name', e.target.value)}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='birthdate'>Fecha de nacimiento</Label>
              <Input
                type='date'
                id='birthdate'
                value={customers[currentCustomer].birthdate}
                onChange={(e) => updateCustomer('birthdate', e.target.value)}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='dni'>DNI</Label>
              <Input
                id='dni'
                value={customers[currentCustomer].dni}
                onChange={(e) => updateCustomer('dni', e.target.value)}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label>Firma</Label>
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
            {/* <div className='space-y-2'>
              <Label htmlFor='signature'>Firma</Label>
              <div className='border rounded-md p-2'>
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={150}
                  className='border w-full touch-none'
                  onMouseDown={startDrawing}
                  onMouseUp={stopDrawing}
                  onMouseOut={stopDrawing}
                  onMouseMove={draw}
                  onTouchStart={startDrawing}
                  onTouchEnd={stopDrawing}
                  onTouchMove={draw}
                />
              </div>
              
            </div> */}
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
        </CardContent>
        <CardFooter className='bg-primary/5 p-6'>
          <Button
            type='submit'
            className='w-full bg-primary text-primary-foreground hover:bg-primary/90'
          >
            Confirmar actividad
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
