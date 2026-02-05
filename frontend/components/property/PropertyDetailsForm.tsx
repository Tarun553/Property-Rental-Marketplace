"use client";

import { UseFormReturn } from "react-hook-form";
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

interface PropertyDetailsFormProps {
  form: UseFormReturn<any>;
}

export function PropertyDetailsForm({ form }: PropertyDetailsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="details.bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bedrooms *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="details.bathrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bathrooms *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
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
            name="details.size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size (sqft)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="1200"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : undefined,
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-3">
          <FormField
            control={form.control}
            name="details.furnished"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="cursor-pointer">Furnished</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="details.petsAllowed"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="cursor-pointer">Pets Allowed</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="details.smokingAllowed"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="cursor-pointer">
                  Smoking Allowed
                </FormLabel>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
