import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

type DropdownProps = {
    items: any[]
    selectedItem: any
    setSelectedItem: (item: any) => void
    alternateStyle?: boolean
}

const Dropdown:React.FC<DropdownProps> = ({ items, selectedItem, setSelectedItem, alternateStyle }) => {

    function getAlternateStyles() {
        if (alternateStyle) {
            return 'p-2'
        } else {
            return ''
        }
    }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className={`inline-flex w-48 justify-between items-center bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 text-sm font-medium text-white/80 transition-all duration-200 rounded-lg capitalize ${getAlternateStyles()}`}>
          {selectedItem}
          <ChevronDownIcon className="-mr-1 h-4 w-4 text-white/50" aria-hidden="true" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-50 mt-1 w-48 origin-top-right bg-[#1e1e2e] border border-white/10 rounded-xl shadow-2xl shadow-black/50 focus:outline-none overflow-hidden">
          <div className="py-1">
            {items.map((item) => (
                <Menu.Item key={item}>
                    {() => (
                        <div
                            className={`block px-4 text-sm capitalize cursor-pointer text-white/70 hover:text-white hover:bg-white/5 transition-colors ${getAlternateStyles()}`}
                            onClick={() => setSelectedItem(item)}
                        >
                            {item}
                        </div>
                    )}
                </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default Dropdown