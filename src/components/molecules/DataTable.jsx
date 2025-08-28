import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const DataTable = ({ 
  data = [], 
  columns = [], 
  maxRows = 10,
  className = "" 
}) => {
  const displayData = data.slice(0, maxRows);
  
  if (data.length === 0) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="text-center py-8">
          <p className="text-slate-400">No data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key}
                  className="px-6 py-4 text-left text-sm font-medium text-slate-300 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {displayData.map((row, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-slate-800/30 transition-colors"
              >
                {columns.map((column) => (
                  <td 
                    key={column.key}
                    className="px-6 py-4 whitespace-nowrap text-sm text-slate-300"
                  >
                    {column.render 
                      ? column.render(row[column.key], row) 
                      : row[column.key]
                    }
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.length > maxRows && (
        <div className="px-6 py-4 bg-slate-800/20 border-t border-slate-700">
          <p className="text-sm text-slate-400 text-center">
            Showing {maxRows} of {data.length} rows
          </p>
        </div>
      )}
    </Card>
  );
};

export default DataTable;