import React from "react"
import { Link } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import ComplianceStatus from "./ComplianceStatus"
import ConfidenceBadge from "./ConfidenceBadge"
import { ArrowRight, Camera } from "lucide-react"

export interface InspectionRecord {
  id: string
  product_name: string
  category: string
  status: string
  confidence: number
  officer_decision?: string
  timestamp?: string
  images_count?: number
}

export interface InspectionTableProps {
  inspections?: InspectionRecord[]
  emptyMessage?: string
}

export default function InspectionTable({
  inspections = [],
  emptyMessage = "No inspections recorded yet.",
}: InspectionTableProps): React.JSX.Element {
  if (!inspections || inspections.length === 0) {
    return (
      <div className="py-10 text-center text-xs text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  const renderOfficerDecision = (decision?: string) => {
    const val = (decision || "PENDING").toUpperCase()
    if (val === "APPROVED" || val === "CONFIRMED") {
      return <Badge variant="compliant">Approved</Badge>
    }
    if (val === "REJECTED") {
      return <Badge variant="violation">Notice Issued</Badge>
    }
    if (val === "FURTHER_INSPECTION") {
      return <Badge variant="warning">Further Inspection</Badge>
    }
    return <Badge variant="neutral">Pending Review</Badge>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[120px]">Docket ID</TableHead>
          <TableHead>Commodity / Product</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Compliance Status</TableHead>
          <TableHead>Confidence</TableHead>
          <TableHead>Officer Sign-off</TableHead>
          <TableHead>Audit Date</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {inspections.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-mono font-bold">
              <Link
                to={`/inspections/${item.id}`}
                className="text-primary hover:underline hover:text-primary/90 transition-colors"
              >
                {item.id}
              </Link>
            </TableCell>
            <TableCell>
              <div className="font-semibold text-foreground">{item.product_name}</div>
              {item.images_count ? (
                <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Camera className="h-3 w-3" />
                  <span>{item.images_count} image(s)</span>
                </span>
              ) : null}
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="text-[10px] font-medium bg-muted/40">
                {item.category}
              </Badge>
            </TableCell>
            <TableCell>
              <ComplianceStatus status={item.status} size="sm" />
            </TableCell>
            <TableCell>
              <ConfidenceBadge value={item.confidence} size="sm" showLabel={false} />
            </TableCell>
            <TableCell>{renderOfficerDecision(item.officer_decision)}</TableCell>
            <TableCell className="text-muted-foreground text-[11px]">
              {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : "Recent"}
            </TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="xs" asChild>
                <Link to={`/inspections/${item.id}`} className="gap-1 font-semibold">
                  <span>View Audit</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
