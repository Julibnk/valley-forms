import Form from './Form';
import './App.css';
function App() {
  return (
    <div className='app min-h-screen bg-gradient-to-b from-primary/10 to-background'>
      <div className='relative h-[200px] overflow-hidden'>
        <img
          src='/images/Lagos.png.webp'
          alt='Adventure activities'
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-b from-transparent to-background/80 flex items-end justify-center pb-8'>
          <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
            Rumbo Norte
          </h1>
        </div>
      </div>
      <div className='flex justify-center py-8'>
        <Form />
      </div>
    </div>
  );
}

export default App;
