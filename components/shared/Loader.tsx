import Image from 'next/image'

type Props = {
    size?: number
}

const Loader = ({size = 100}: Props) => {
  return (
    <div className='h-full w-full flex items-center justify-center'>
        <Image src="/logo.svg" 
        alt="Loading..."
        width={size}
        height={size}
        className="animate-pulse duration-700"
        />
    </div>
  )
}

export default Loader