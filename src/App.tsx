import Form from './Form';
import './App.css';
function App() {
  return (
    <div className='app min-h-screen bg-gradient-to-b from-primary/20 to-background"'>
      <div className='relative h-[200px] overflow-hidden'>
        <img
          src='/images/Lagos.png.webp'
          alt='Adventure activities'
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-b from-transparent to-background/80 flex items-end justify-center pb-8'>
          <h1 className='text-4xl font-bold text-white drop-shadow-md'>
            Rumbo Norte
          </h1>
        </div>
      </div>
      <div className='container mx-auto px-4 py-8'>
        <Form />
      </div>
    </div>
  );
}

export default App;
