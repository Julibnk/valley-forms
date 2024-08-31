import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { generateClient } from 'aws-amplify/api';
import { Schema } from 'amplify/data/resource';
import { Button } from './ui/button';
import { FileDown } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Badge } from './ui/badge';

const client = generateClient<Schema>();

export const BookingTable = () => {
  const [bookings, setBookings] = useState<Array<Schema['Booking']['type']>>(
    []
  );

  useEffect(() => {
    client.models.Booking.observeQuery().subscribe({
      next: (data) => setBookings([...data.items]),
    });
  }, []);

  return (
    <Card x-chunk='dashboard-05-chunk-3'>
      <CardHeader className='px-7'>
        <CardTitle>Historico de actividades</CardTitle>
        <CardDescription>
          Consulte y descargue actividades antiguas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Lista de actividades.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Actividad</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className='text-right'>Descargar PDF</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className='font-medium'>
                  <Badge>{booking.activity}</Badge>
                </TableCell>
                <TableCell>{booking.date}</TableCell>
                <TableCell className='text-right'>
                  <Button variant='ghost' size='sm' asChild>
                    <a href={booking.pdfUrl ?? ''} download>
                      <FileDown className='mr-2 h-4 w-4' />
                      PDF
                    </a>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
