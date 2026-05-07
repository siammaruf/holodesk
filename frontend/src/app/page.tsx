import AnimatedCharacter from './play/SkinMenu/AnimatedCharacter'
import { Link } from 'react-router-dom'
import BasicButton from '@/components/BasicButton'
import { Code } from '@phosphor-icons/react'

export default function Index() {
  return (
    <div className='w-full grid place-items-center h-screen gradient p-4 relative'>
      <div className='max-w-[600px] flex flex-col items-center'>
        <div>
          <h1 className='font-semibold text-3xl'>Welcome to HoloDesk!</h1>
          <p className='w-full text-xl my-6'>
            A fully customizable virtual space with proximity-based video chat,
            tile-based movement, and multiplayer networking. AI-ready architecture.
          </p>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <Link to='/app'>
            <BasicButton>
              Get Started
            </BasicButton>
          </Link>
        </div>
        <div className='flex flex-row items-center justify-center mt-6 gap-8'>
          <p className='text-sm'>created by <span className='font-bold'>HoloDesk Team</span></p>
          <div className='inline-flex flex-row items-center justify-center gap-2'>
            <a href='https://github.com' target="_blank" rel="noopener noreferrer" className='text-sm underline font-bold'>see the code</a>
            <Code className='w-4 h-4'/>
          </div>
        </div>
        <AnimatedCharacter src='/sprites/characters/Character_009.png'/>
      </div>
    </div>
  )
}
