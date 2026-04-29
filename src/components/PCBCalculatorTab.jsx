import EmployeeProfileForm from './EmployeeProfileForm'
import PCBResultsPanel from './PCBResultsPanel'

export default function PCBCalculatorTab({ inputs, onInputChange, result }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">
        <EmployeeProfileForm inputs={inputs} onChange={onInputChange} />
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">
        <PCBResultsPanel result={result} inputs={inputs} />
      </div>
    </div>
  )
}
