"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { PropertyFormProps } from "@/types/form";

export function PricingForm({ form }: PropertyFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="pricing.monthlyRent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Rent ($) *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  placeholder="2500"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pricing.securityDeposit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Security Deposit ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  placeholder="2500"
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseFloat(e.target.value) : undefined,
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pricing.utilitiesIncluded"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="cursor-pointer">
                Utilities Included
              </FormLabel>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
