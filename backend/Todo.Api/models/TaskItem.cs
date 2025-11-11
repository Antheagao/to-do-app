namespace Todo.Api.Models;

public class TaskItem
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string? Description { get; set; }
    public DateOnly DueDate { get; set; }          // required
    public TimeOnly? DueTime { get; set; }         // optional
    public int Urgency { get; set; } = 3;          // 1..5
    public bool IsCompleted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    public string UserId { get; set; } = "";
}
