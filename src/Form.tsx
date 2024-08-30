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
} from 'lucide-react';

export default function Form() {
  const [customers, setCustomers] = useState([
    { name: '', birthdate: '', dni: '', signature: null },
  ]);
  const [currentCustomer, setCurrentCustomer] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

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

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      updateCustomer('signature', canvas.toDataURL());
    }
  };

  const [showTerms, setShowTerms] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
      const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      updateCustomer('signature', null);
    }
  };

  return (
    <Card className='w-full max-w-2xl'>
      <CardHeader>
        <CardTitle>Activity Confirmation</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='activity'>Select Activity</Label>
            <Select required>
              <SelectTrigger id='activity'>
                <SelectValue placeholder='Choose an activity' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='hiking'>Hiking</SelectItem>
                <SelectItem value='swimming'>Swimming</SelectItem>
                <SelectItem value='cycling'>Cycling</SelectItem>
                <SelectItem value='kayaking'>Kayaking</SelectItem>
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
                  <span className='sr-only'>Next customer</span>
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  onClick={addCustomer}
                >
                  <Plus className='h-4 w-4' />
                  <span className='sr-only'>Add customer</span>
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
              <Label htmlFor='birthdate'>Birthdate</Label>
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
              <Label htmlFor='signature'>Signature</Label>
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
              <Button type='button' variant='outline' onClick={clearSignature}>
                Clear Signature
              </Button>
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
        </CardContent>
        <CardFooter>
          <Button type='submit' className='w-full'>
            Confirm Activity
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
